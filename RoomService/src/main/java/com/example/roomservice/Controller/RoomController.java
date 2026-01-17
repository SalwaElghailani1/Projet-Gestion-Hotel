package com.example.roomservice.Controller;

import com.example.roomservice.DTO.RequestDtoRoom;
import com.example.roomservice.DTO.ResponseDtoRoom;
import com.example.roomservice.DTO.RoomStatsDto;
import com.example.roomservice.Service.RoomService;
import com.example.roomservice.Config.RsaKeys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    private RsaKeys rsaKeys; // public key already configured

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadRoomImage(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            Path path = Paths.get(uploadDir, file.getOriginalFilename());
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            String imageUrl = "/uploads/" + file.getOriginalFilename();
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving file");
        }
    }

    // ================= GET ALL ROOMS (any USER) =================
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping
    public ResponseEntity<List<ResponseDtoRoom>> getAllRooms() {
        List<ResponseDtoRoom> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    // ================= GET ROOM BY ID (any USER) =================
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDtoRoom> getRoomById(@PathVariable int id) {
        ResponseDtoRoom room = roomService.getRoomById(id);
        if (room != null) {
            return ResponseEntity.ok(room);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ================= HELPER METHOD =================
    private boolean isManager(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;

        String token = authHeader.substring(7); // remove "Bearer "

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(rsaKeys.publicKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof java.util.List<?> rolesList) {
                return rolesList.contains("MANAGER");
            }

            return false;
        } catch (Exception e) {
            return false; // token invalid or expired
        }
    }

    // RECEPTIONIST
    private boolean isReceptionist(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;

        String token = authHeader.substring(7); // remove "Bearer "

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(rsaKeys.publicKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof java.util.List<?> rolesList) {
                return rolesList.contains("RECEPTIONNISTE");
            }

            return false;
        } catch (Exception e) {
            return false; // token invalid or expired
        }
    }

    // HOUSEKEEPING
    private boolean isHousekeeping(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;

        String token = authHeader.substring(7); // remove "Bearer "

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(rsaKeys.publicKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof java.util.List<?> rolesList) {
                return rolesList.contains("HOUSEKEEPING");
            }

            return false;
        } catch (Exception e) {
            return false; // token invalid or expired
        }
    }
    // ================= CREATE ROOM (MANAGER only) =================
    @PostMapping
    public ResponseEntity<ResponseDtoRoom> createRoom(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody RequestDtoRoom dto){

        if (!isManager(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        ResponseDtoRoom room = roomService.createRoom(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    // ================= UPDATE ROOM (MANAGER only) =================
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDtoRoom> updateRoom(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id,
            @RequestBody RequestDtoRoom dto){

        if (!isManager(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        ResponseDtoRoom updated = roomService.updateRoom(id, dto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ================= DELETE ROOM (MANAGER only) =================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id) {

        if (!isManager(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boolean deleted = roomService.deleteRoom(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ================= TOGGLE ROOM STATE (Receptionist et manager only) =================
    @PatchMapping("/{id}/etat/{etat}")
    public ResponseDtoRoom toggleRoomState(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id,
            @PathVariable String etat) {
        return roomService.setRoomEtat(id, etat);
    }



    // GET ROOM BY NUMERO (any user)
    @GetMapping("/numero/{numero}")
    public ResponseEntity<ResponseDtoRoom> getRoomByNumero(@PathVariable String numero) {
        ResponseDtoRoom room = roomService.getAllRooms()
                .stream()
                .filter(r -> String.valueOf(r.getNumero()).trim().equals(numero.trim()))
                .findFirst()
                .orElse(null);

        if (room != null) {
            return ResponseEntity.ok(room);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // GET rooms by prix (any user)
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/prix/{prix}")
    public ResponseEntity<List<ResponseDtoRoom>> getRoomsByPrix(@PathVariable double prix) {
        List<ResponseDtoRoom> rooms = roomService.getAllRooms()
                .stream()
                .filter(r -> r.getPrix() >= prix)
                .toList();
        return ResponseEntity.ok(rooms);
    }

    // GET rooms by type (any user)
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ResponseDtoRoom>> getRoomsByType(@PathVariable String type) {
        List<ResponseDtoRoom> rooms = roomService.getAllRooms()
                .stream()
                .filter(r -> r.getType().equalsIgnoreCase(type))
                .toList();
        return ResponseEntity.ok(rooms);
    }







    @GetMapping("/stats")
    public ResponseEntity<RoomStatsDto> getRoomStats(
            @RequestHeader("Authorization") String authHeader) {

        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(roomService.getRoomStatistics());
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;

        String token = authHeader.substring(7); // remove "Bearer "

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(rsaKeys.publicKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof java.util.List<?> rolesList) {
                return rolesList.contains("ADMIN");
            }

            return false;
        } catch (Exception e) {
            return false; // token invalid or expired
        }
    }

}
