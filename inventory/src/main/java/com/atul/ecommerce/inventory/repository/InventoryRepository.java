package com.atul.ecommerce.inventory.repository;

import com.atul.ecommerce.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;  

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Inventory findByProductId(String productId);

}
