package be.kuleuven.dsgt4.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ResponseSupplier {
    private boolean response;
    private String error;
    private Map<String, Integer> outOfStockItems;

    public Map<String, Integer> getOutOfStockItems() {
        return outOfStockItems;
    }

    public void setOutOfStockItems(Map<String, Integer> outOfStockItems) {
        this.outOfStockItems = outOfStockItems;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public boolean getResponse() {
        return response;
    }

    public void setResponse(boolean response) {
        this.response = response;
    }

    public String toString() {
        return this.response + " " + this.error + " " + this.outOfStockItems;
    }
}
