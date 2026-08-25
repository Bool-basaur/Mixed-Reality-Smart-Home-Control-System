using System;

[Serializable]
public class SpatialInformationRequest
{
    public string entityId;

    public string homeId;

    public string roomId;

    public string zoneId; 
    
    public string anchorId;

    public Position position;

    public Rotation rotation;
}