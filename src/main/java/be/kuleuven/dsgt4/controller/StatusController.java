package be.kuleuven.dsgt4.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.google.cloud.firestore.Query;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/status")
public class StatusController {

    public enum TransactionStatus {
        COMMIT,
        ROLLBACK
    }

    @Autowired
    private Firestore db;

    @GetMapping("/last-order-status")
    public ResponseEntity<Map<String, Object>> getLastOrderStatus() {
        try {
            // Fetch the last document in the 'orders' collection
            System.out.println("Fetching last order status...");

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

            System.out.println("Last order status: " + response);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}