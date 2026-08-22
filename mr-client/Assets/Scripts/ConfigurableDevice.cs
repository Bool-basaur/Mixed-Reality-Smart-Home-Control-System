using UnityEngine;

public class ConfigurableDevice : MonoBehaviour
{
    [SerializeField]
    private string entityId;

    [SerializeField]
    private string deviceName;

    [SerializeField]
    private string category;

    public string EntityId => entityId;
    public string DeviceName => deviceName;
    public string Category => category;

    public void Setup(UnconfiguredDevice device)
    {
        entityId = device.id;
        deviceName = device.name;
        category = device.category;
    }
}