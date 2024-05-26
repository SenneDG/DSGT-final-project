package be.kuleuven.dsgt4.controller;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;

import be.kuleuven.dsgt4.dto.Item;
import be.kuleuven.dsgt4.dto.Order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final Firestore firestore;

    @Autowired
    public ManagerController(Firestore firestore) {
        this.firestore = firestore;
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/orders")
    public List<Order> getAllOrders() throws ExecutionException, InterruptedException {
        var querySnapshot = firestore.collection("orders").get().get();
        List<Order> allOrders = new ArrayList<>();
        for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) document.get("items");
            String state = (String) document.get("state");
            List<Item> orderItems = items.stream()
                    .map(itemMap -> {
                        Item item = new Item();
                        item.setId((String) itemMap.get("id"));
                        item.setName((String) itemMap.get("name"));
                        item.setQuantity((Long) itemMap.get("quantity"));
                        return item;
                    })
                    .collect(Collectors.toList());
            Order order = new Order();
            order.setItems(orderItems);
            order.setState(state);
            allOrders.add(order);
        }
        return allOrders;
    }
}