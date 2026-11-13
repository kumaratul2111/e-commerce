package com.atul.ecommerce.inventory.service;

import com.atul.ecommerce.inventory.entity.Inventory;
import com.atul.ecommerce.inventory.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    //Constructor
    @Autowired
    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }


    public Inventory getInventory(String productId) {
        return inventoryRepository.findByProductId(productId);
    }
}
