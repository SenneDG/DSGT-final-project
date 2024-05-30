package be.kuleuven.dsgt4.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import com.google.cloud.firestore.Query;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.common.util.concurrent.MoreExecutors;


import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import be.kuleuven.dsgt4.dto.ShopItem;
import be.kuleuven.dsgt4.dto.ResponseSupplier;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;


@RestController
@RequestMapping("/api/general")
public class SupplierController {

    private final WebClient webClient1;
    private final WebClient webClient2;
    private final Firestore db;

    public enum TransactionStatus {
        COMMIT,
        ROLLBACK
    }

    public SupplierController(WebClient.Builder webClientBuilder, Firestore db) {
        String supplier1ApiKey = "Iw8zeveVyaPNWonPNaU0213uw3g6Ei";
        this.webClient1 = WebClient.builder()
                .baseUrl("http://localhost:9090/api?key=" + supplier1ApiKey)
                .build();

        String supplier2ApiKey = "Iw8zeveVyaPNWonPNaU0213uw3g6Ei";
        this.webClient2 = WebClient.builder()
                .baseUrl("http://localhost:9091/api?key=" + supplier2ApiKey)
                .build();
        this.db = db;
        System.out.println("SupplierController Firestore instance: " + db);
    }

    @GetMapping("/get-all-shop-items")
    public Mono<List<ShopItem>> getAllShopItems() {
        Flux<ShopItem> shopItems1 = webClient1.get()
                .uri("/shop-items")
                .retrieve()
                .bodyToFlux(JsonNode.class)
                .flatMap(jsonNode -> {
                    JsonNode shopItemList = jsonNode.path("_embedded").path("shopItemList");
                    return Flux.fromIterable(shopItemList)
                            .map(itemNode -> {
                                ShopItem shopItem = new ShopItem();
                                shopItem.setId(UUID.fromString(itemNode.get("id").asText()));
                                shopItem.setSupplier("Supplier 1");
                                shopItem.setName(itemNode.get("name").asText());
                                shopItem.setDescription(itemNode.get("description").asText());
                                shopItem.setPrice(itemNode.get("price").asDouble());
                                shopItem.setQuantity(itemNode.get("quantity").asInt());
                                shopItem.setImageUrl(itemNode.get("imageUrl").asText());
                                return shopItem;
                            });
                })
                .doOnError(e -> System.err.println("Error fetching items from Supplier 1: " + e.getMessage()))
                .onErrorResume(e -> Flux.empty());

        Flux<ShopItem> shopItems2 = webClient2.get()
                .uri("/shop-items")
                .retrieve()
                .bodyToFlux(JsonNode.class)
                .flatMap(jsonNode -> {
                    JsonNode shopItemList = jsonNode.path("_embedded").path("shopItemList");
                    return Flux.fromIterable(shopItemList)
                            .map(itemNode -> {
                                ShopItem shopItem = new ShopItem();
                                shopItem.setId(UUID.fromString(itemNode.get("id").asText()));
                                shopItem.setSupplier("Supplier 2");
                                shopItem.setName(itemNode.get("name").asText());
                                shopItem.setDescription(itemNode.get("description").asText());
                                shopItem.setPrice(itemNode.get("price").asDouble());
                                shopItem.setQuantity(itemNode.get("quantity").asInt());
                                shopItem.setImageUrl(itemNode.get("imageUrl").asText());
                                return shopItem;
                            });
                })
                .doOnError(e -> System.err.println("Error fetching items from Supplier 2: " + e.getMessage()))
                .onErrorResume(e -> Flux.empty());

        return Flux.concat(shopItems1, shopItems2)
                .collectList();
    }

    @GetMapping("/last-order-status")
    public ResponseEntity<Map<String, Object>> getLastOrderStatus() {
        try {
            // Fetch the last document in the 'orders' collection
            ApiFuture<QuerySnapshot> query = db.collection("orders").orderBy("timestamp", Query.Direction.DESCENDING).limit(1).get();
            QuerySnapshot querySnapshot = query.get();
            List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();

            if (documents.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            DocumentSnapshot lastOrder = documents.get(0);
            Map<String, Object> orderData = lastOrder.getData();

            // Retrieve the ShopItems and status
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
            TransactionStatus status = TransactionStatus.valueOf((String) orderData.get("state"));

            // Prepare the response
            Map<String, Object> response = new HashMap<>();
            response.put("items", items);
            response.put("status", status);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<ResponseSupplier> checkout(@RequestBody List<ShopItem> items) {
        List<ShopItem> supplier1Items = new ArrayList<>();
        List<ShopItem> supplier2Items = new ArrayList<>();
        String orderId = UUID.randomUUID().toString();

        for (ShopItem item : items) {
            if ("Supplier 1".equals(item.getSupplier())) {
                supplier1Items.add(item);
            } else if ("Supplier 2".equals(item.getSupplier())) {
                supplier2Items.add(item);
            }
        }

        ResponseSupplier res = callPreparePhase(supplier1Items, supplier2Items);
        System.out.println(res);
        if(res.getResponse()){
            System.out.println("Prepare phase successful");
            if(callCommitPhase(supplier1Items, supplier2Items, orderId)){
                System.out.println("Commit phase successful");
                putOrderInFirestore(items, TransactionStatus.COMMIT, orderId, db);
                return ResponseEntity.ok(res);
            } else {
                callRollbackPhase(supplier1Items, supplier2Items, orderId);
                putOrderInFirestore(items, TransactionStatus.ROLLBACK, orderId, db);
                System.out.println("Rollback phase successful");
                res.setError("Checkout failed: error during commit phase");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
            }
        } else {
            callRollbackPhase(supplier1Items, supplier2Items, orderId);
            putOrderInFirestore(items, TransactionStatus.ROLLBACK, orderId, db);
            System.out.println("Rollback phase successful");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }


    private ResponseSupplier callPreparePhase(List<ShopItem> supplier1Items, List<ShopItem> supplier2Items) {
        ResponseSupplier res = new ResponseSupplier();
        Map<String, Integer> supplier1Success = new HashMap<String, Integer>();
        Map<String, Integer> supplier2Success = new HashMap<String, Integer>();

        if (!supplier1Items.isEmpty()) {
            supplier1Success = webClient1.post()
                    .uri("/shop-items/prepare-checkout")
                    .bodyValue(supplier1Items)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        }

        if (!supplier2Items.isEmpty()) {
            supplier2Success = webClient2.post()
                    .uri("/shop-items/prepare-checkout")
                    .bodyValue(supplier2Items)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

        }

        System.out.println(supplier1Success);
        System.out.println(supplier2Success);

        res.setResponse((supplier1Success == null || supplier1Success.isEmpty()) && (supplier2Success == null || supplier2Success.isEmpty()));
        Map<String, Integer> outOfStockItems = new HashMap<String, Integer>();

        System.out.println(res.getResponse());

        if (supplier1Success != null) {
            for (String key : supplier1Success.keySet()) {
                outOfStockItems.put(key, supplier1Success.get(key));
            }
        }

        if (supplier2Success != null) {
            for (String key : supplier2Success.keySet()) {
                outOfStockItems.put(key, supplier2Success.get(key));
            }
        }

        System.out.println(outOfStockItems);

        if (!res.getResponse()) {
            res.setError("Not in stock");
        }

        res.setOutOfStockItems(outOfStockItems);

        return res;
    }

    public boolean callCommitPhase(List<ShopItem> supplier1Items, List<ShopItem> supplier2Items, String orderId) {
        putOrderStatusInFirestore(TransactionStatus.COMMIT, orderId, db);

        boolean supplier1Success = true;
        boolean supplier2Success = true;

        if (!supplier1Items.isEmpty()) {
            supplier1Success = webClient1.post()
                    .uri("/shop-items/commit-checkout")
                    .bodyValue(supplier1Items)
                    .retrieve()
                    .toBodilessEntity()
                    .onErrorReturn(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
                    .block()
                    .getStatusCode()
                    .is2xxSuccessful();
        }

        if (!supplier2Items.isEmpty()) {
            supplier2Success = webClient2.post()
                    .uri("/shop-items/commit-checkout")
                    .bodyValue(supplier2Items)
                    .retrieve()
                    .toBodilessEntity()
                    .onErrorReturn(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
                    .block()
                    .getStatusCode()
                    .is2xxSuccessful();
        }

        return supplier1Success && supplier2Success;
    }

    public boolean callRollbackPhase(List<ShopItem> supplier1Items, List<ShopItem> supplier2Items, String orderId) {
        boolean supplier1Success = true;
        boolean supplier2Success = true;

        if (!supplier1Items.isEmpty()) {
            supplier1Success = webClient1.post()
                    .uri("/shop-items/rollback-checkout")
                    .bodyValue(supplier1Items)
                    .retrieve()
                    .toBodilessEntity()
                    .onErrorReturn(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
                    .block()
                    .getStatusCode()
                    .is2xxSuccessful();
        }

        if (!supplier2Items.isEmpty()) {
            supplier2Success = webClient2.post()
                    .uri("/shop-items/rollback-checkout")
                    .bodyValue(supplier2Items)
                    .retrieve()
                    .toBodilessEntity()
                    .onErrorReturn(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
                    .block()
                    .getStatusCode()
                    .is2xxSuccessful();
        }

        return supplier1Success && supplier2Success;
    }


    public void putOrderInFirestore(List<ShopItem> shopItems, TransactionStatus state, String orderId, Firestore db) {
        System.out.printf("ShopItems: %s\n", shopItems);
        if (shopItems.isEmpty()) {
            System.out.println("No items to process");
            return;
        }

        // Create a new document with an auto-generated ID
        DocumentReference docRef = db.collection("orders").document();

        // Create a List to store the items
        List<Map<String, Object>> items = new ArrayList<>();

        for (int i = 0; i < shopItems.size(); i++) {
            ShopItem shopItem = shopItems.get(i);
            // Create a Map to store the data we want to set
            Map<String, Object> data = new HashMap<>();
            data.put("id", shopItem.getId().toString());
            data.put("name", shopItem.getName());
            data.put("quantity", shopItem.getQuantity());

            items.add(data);
        }

        // Create a Map for the order
        Map<String, Object> order = new HashMap<>();
        order.put("timestamp", System.currentTimeMillis());
        order.put("items", items);
        order.put("state", state);

        ApiFuture<com.google.cloud.firestore.WriteResult> result = docRef.set(order);

        result.addListener(new Runnable() {
            @Override
            public void run() {
                try {
                    com.google.cloud.firestore.WriteResult writeResult = result.get();
                    System.out.println("Order successfully written at: " + writeResult.getUpdateTime());
                } catch (Exception e) {
                    System.out.println("Failed to write order: " + e.getMessage());
                }
            }
        }, MoreExecutors.directExecutor());
    }

    public void putOrderStatusInFirestore(TransactionStatus state, String orderId,  Firestore db) {
        // Create a new document with an auto-generated ID
        DocumentReference docRef = db.collection("orderStatus").document();

        // Create a Map for the order
        Map<String, Object> order = new HashMap<>();
        order.put("orderId", orderId);
        order.put("state", state);

        ApiFuture<com.google.cloud.firestore.WriteResult> result = docRef.set(order);

        result.addListener(new Runnable() {
            @Override
            public void run() {
                try {
                    com.google.cloud.firestore.WriteResult writeResult = result.get();
                    System.out.println("Order successfully written at: " + writeResult.getUpdateTime());
                } catch (Exception e) {
                    System.out.println("Failed to write order: " + e.getMessage());
                }
            }
        }, MoreExecutors.directExecutor());
    }
}

