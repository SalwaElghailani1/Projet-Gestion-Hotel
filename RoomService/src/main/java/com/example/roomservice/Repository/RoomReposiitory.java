package com.example.roomservice.Repository;

import com.example.roomservice.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomReposiitory extends JpaRepository<Room, Integer> {
}
