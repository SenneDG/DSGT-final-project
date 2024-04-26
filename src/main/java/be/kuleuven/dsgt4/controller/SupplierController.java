package be.kuleuven.dsgt4.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.common.util.concurrent.MoreExecutors;


import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import be.kuleuven.dsgt4.dto.ShopItem;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/general")
public class SupplierController {

    private final WebClient webClient1;
    private final WebClient webClient2;
    private Firestore db;

    public SupplierController(WebClient.Builder webClientBuilder, Firestore db) {
        this.webClient1 = webClientBuilder.baseUrl("http://localhost:9090/api").build();
        this.webClient2 = webClientBuilder.baseUrl("http://localhost:9091/api").build();
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
                .onErrorResume(e -> Flux.empty());

        return Flux.concat(shopItems1, shopItems2)
                .collectList();
    }

    @PostMapping("/checkout")
    public Mono<ResponseEntity<Void>> checkout(@RequestBody List<Map<String, String>> items) {
        List<ShopItem> checkedOutItems = new ArrayList<>();
        List<Integer> quantities = new ArrayList<>();

        return Flux.fromIterable(items)
                .flatMap(item -> {
                    UUID id = UUID.fromString(item.get("id"));
                    int quantity = Integer.parseInt(item.get("quantity"));
                    String supplier = item.get("supplier");

                    Mono<ShopItem> shopItem;
                    WebClient webClient;

                    if ("Supplier 1".equals(supplier)) {
                        webClient = webClient1;
                    } else if ("Supplier 2".equals(supplier)) {
                        webClient = webClient2;
                    } else {
                        return Mono.error(new RuntimeException("Unknown supplier: " + supplier));
                    }

                    shopItem = webClient.get()
                            .uri("/shop-items/{id}", id)
                            .retrieve()
                            .onStatus(HttpStatus::is5xxServerError, clientResponse -> Mono.empty())
                            .bodyToMono(ShopItem.class)
                            .onErrorResume(e -> Mono.empty());

                    return shopItem
                            .flatMap(item1 -> {
                                if (item1 != null && item1.getQuantity() < quantity) {
                                    return Mono.error(new RuntimeException("Not enough items in stock: " + id));
                                }

                                quantities.add(quantity);

                                Mono<ShopItem> checkoutItem = webClient.post()
                                        .uri(uriBuilder -> uriBuilder.path("/shop-items/checkout")
                                                .queryParam("id", id.toString())
                                                .queryParam("quantity", Integer.toString(quantity))
                                                .build())
                                        .retrieve()
                                        .bodyToMono(ShopItem.class)
                                        .doOnSuccess(checkedOutItem -> checkedOutItems.add(checkedOutItem))
                                        .onErrorResume(e -> Mono.empty());

                                return checkoutItem;
                            });
                })
                .then(Mono.fromRunnable(() -> putOrderInFirestore(checkedOutItems, quantities, db)))
                .then(Mono.just(ResponseEntity.ok().build()));
    }

    public void putOrderInFirestore(List<ShopItem> shopItems, List<Integer> quantities, Firestore db) {
        // Create a new document with an auto-generated ID
        DocumentReference docRef = db.collection("orders").document();

        // Create a List to store the items
        List<Map<String, Object>> items = new ArrayList<>();

        for (int i = 0; i < shopItems.size(); i++) {
            ShopItem shopItem = shopItems.get(i);
            int quantity = quantities.get(i);
            // Create a Map to store the data we want to set
            Map<String, Object> data = new HashMap<>();
            data.put("id", shopItem.getId());
            data.put("name", shopItem.getName());
            data.put("quantity", quantity);

            items.add(data);
        }

        // Create a Map for the order
        Map<String, Object> order = new HashMap<>();
        order.put("items", items);

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

