package com.atul.ecommerce.products.repository;

import com.atul.ecommerce.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
