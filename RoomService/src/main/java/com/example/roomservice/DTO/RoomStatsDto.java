package com.example.roomservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class RoomStatsDto {

    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;

    private long singleRooms;
    private long doubleRooms;
    private long suiteRooms;

    private double averagePrice;


    public long getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(long availableRooms) {
        this.availableRooms = availableRooms;
    }

    public long getOccupiedRooms() {
        return occupiedRooms;
    }
    public void setOccupiedRooms(long occupiedRooms) {
        this.occupiedRooms = occupiedRooms;
    }
    public long getMaintenanceRooms() {
        return maintenanceRooms;
    }
    public void setMaintenanceRooms(long maintenanceRooms) {
        this.maintenanceRooms = maintenanceRooms;
    }
    public long getSingleRooms() {
        return singleRooms;
    }
    public void setSingleRooms(long singleRooms) {
        this.singleRooms = singleRooms;
    }
    public long getDoubleRooms() {
        return doubleRooms;
    }
    public void setDoubleRooms(long doubleRooms) {
        this.doubleRooms = doubleRooms;
    }
    public long getSuiteRooms() {
        return suiteRooms;
    }
    public void setSuiteRooms(long suiteRooms) {
        this.suiteRooms = suiteRooms;
    }
    public double getAveragePrice() {
        return averagePrice;
    }
    public void setAveragePrice(double averagePrice) {
        this.averagePrice = averagePrice;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }
}
