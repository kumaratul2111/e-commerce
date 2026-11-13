package com.atul.ecommerce.users.repository;

import org.springframework.stereotype.Repository;
import com.atul.ecommerce.users.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
