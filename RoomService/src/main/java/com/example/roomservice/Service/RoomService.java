package com.example.roomservice.Service;

import com.example.roomservice.DTO.RequestDtoRoom;
import com.example.roomservice.DTO.ResponseDtoRoom;
import com.example.roomservice.DTO.RoomStatsDto;
import com.example.roomservice.Mapper.RoomMapper;
import com.example.roomservice.Repository.RoomReposiitory;
import com.example.roomservice.entity.Room;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomReposiitory roomRepository;
    private final String uploadDir = "uploads/";

    public RoomService(RoomReposiitory roomRepository) {
        this.roomRepository = roomRepository;
    }

    // List all rooms
    public List<ResponseDtoRoom> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(RoomMapper::entityToDto)
                .collect(Collectors.toList());
    }

    // Get room by ID
    public ResponseDtoRoom getRoomById(int id) {
        Optional<Room> room = roomRepository.findById(id);
        return room.map(RoomMapper::entityToDto).orElse(null);
    }

    // Save file locally and return filename

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        File folder = new File(uploadDir);
        if (!folder.exists()) folder.mkdirs();

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(folder, filename);
        file.transferTo(dest); // save file
        return filename;
    }

    // Create new room
    public ResponseDtoRoom createRoom(RequestDtoRoom dto){
        Room room = RoomMapper.dtoToEntity(dto);
        Room savedRoom = roomRepository.save(room); // save in DB
        return RoomMapper.entityToDto(savedRoom);
    }

    // Update room
    public ResponseDtoRoom updateRoom(int id, RequestDtoRoom dto){
        Optional<Room> roomOpt = roomRepository.findById(id);
        if (roomOpt.isPresent()) {
            Room room = roomOpt.get();
            room.setNumero(dto.getNumero());
            room.setType(dto.getType());
            room.setPrix(dto.getPrix());
            room.setEtat(dto.getEtat());
            room.setDescription(dto.getDescription());
            room.setImage(dto.getImage());
            room.setTaux(dto.getTaux());
            room.setLit_long(dto.getLit_long());
            room.setLit_large(dto.getLit_large());
            Room updatedRoom = roomRepository.save(room); // update in DB
            return RoomMapper.entityToDto(updatedRoom);
        }
        return null;
    }

    // Delete room
    public boolean deleteRoom(int id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Change room state (Disponible <-> occupée)
    public ResponseDtoRoom setRoomEtat(int id, String etat) {
        Optional<Room> roomOpt = roomRepository.findById(id);
        if (roomOpt.isPresent()) {
            Room room = roomOpt.get();
            room.setEtat(etat); //
            Room updatedRoom = roomRepository.save(room);
            return RoomMapper.entityToDto(updatedRoom);
        }
        return null;
    }

    // pour statistique de admin
    public RoomStatsDto getRoomStatistics() {

        List<Room> rooms = roomRepository.findAll();

        RoomStatsDto stats = new RoomStatsDto();

        stats.setTotalRooms(rooms.size());

        stats.setAvailableRooms(
                rooms.stream().filter(r -> r.getEtat().equalsIgnoreCase("Disponible")).count()
        );

        stats.setOccupiedRooms(
                rooms.stream().filter(r -> r.getEtat().equalsIgnoreCase("Occupée")).count()
        );

        stats.setMaintenanceRooms(
                rooms.stream().filter(r -> r.getEtat().equalsIgnoreCase("Maintenance")).count()
        );

        stats.setSingleRooms(
                rooms.stream().filter(r -> r.getType().equalsIgnoreCase("Single")).count()
        );

        stats.setDoubleRooms(
                rooms.stream().filter(r -> r.getType().equalsIgnoreCase("Double")).count()
        );

        stats.setSuiteRooms(
                rooms.stream().filter(r -> r.getType().equalsIgnoreCase("Suite")).count()
        );

        stats.setAveragePrice(
                rooms.stream().mapToDouble(Room::getPrix).average().orElse(0)
        );

        return stats;
    }

}
