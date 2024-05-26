package be.kuleuven.dsgt4.dto;

import java.util.List;

public class Order {
    private List<Item> items;
    private String state;

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
