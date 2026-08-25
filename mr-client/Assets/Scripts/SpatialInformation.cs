using System;

[Serializable]
public class SpatialInformation
{
    public string entityId;

    public string homeId;
    public string roomId;
    public string zoneId;

    public string anchorId;

    public Position position;
    public Rotation rotation;
}