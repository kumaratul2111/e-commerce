package com.atul.ecommerce.inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.atul.ecommerce.inventory.entity.Inventory;
import com.atul.ecommerce.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
public class InventoryController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/inventory/{productId}")
    public Inventory getInventory(@PathVariable String productId) {
        // Implementation for fetching inventory by product ID
        Inventory inventory = inventoryService.getInventory(productId);
        return inventory;
    }
}
