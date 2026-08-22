using UnityEngine;
using UnityEngine.InputSystem;
public class ConfigurationManager : MonoBehaviour{
    public ApiClient apiClient;

    public DeviceSpawner spawner;

    private GameObject currentDevice; 
    
    private UnconfiguredDevice[] pendingDevices;

    private int currentIndex = 0;

    void Start()
    {
        /* apiClient.GetUnconfiguredDevices(devices => {
                 if (devices == null || devices.Length == 0) {
                     Debug.Log("[APP] No devices pending configuration");
                     return;
                 }
                 pendingDevices = devices;
                 SpawnNextDevice();
             }
         );*/
        Debug.Log("[APP] ConfigurationManager waiting");
    }

    void Update(){
        if (Keyboard.current.spaceKey.wasPressedThisFrame)
        {
            SaveCurrentDevice();
        }
    }

    public void StartConfiguration()
    {
        apiClient.GetUnconfiguredDevices(devices =>
        {
            if (devices == null || devices.Length == 0)
            {
                Debug.Log("[APP] No devices pending configuration");
                return;
            }

            pendingDevices = devices;

            currentIndex = 0;

            SpawnNextDevice();
        });
    }

    public void SaveCurrentDevice()
    {
        if (currentDevice == null) {
            Debug.LogWarning("[APP] No device selected");
            return;
        }

        ConfigurableDevice config = currentDevice.GetComponent<ConfigurableDevice>();

        if (config == null) {
            Debug.LogError("[APP] ConfigurableDevice component missing");
            return;
        }

        SpatialInformationRequest request = new SpatialInformationRequest();

        request.entityId = config.EntityId;

        request.homeId = "main-home";

        request.roomId = "main-room";

        request.zoneId = "main-zone";

        request.position = new Position
            {
                x = currentDevice.transform.position.x,
                y = currentDevice.transform.position.y,
                z = currentDevice.transform.position.z
            };

        Vector3 euler = currentDevice.transform.rotation.eulerAngles;

        request.rotation = new Rotation{ x = euler.x, y = euler.y, z = euler.z };

        apiClient.SaveSpatialInformation(request, () => {
                Debug.Log("[APP] Device configured successfully");
                Destroy(currentDevice);
                currentDevice = null;
                currentIndex++;
                SpawnNextDevice();
        });
    }

    private void SpawnNextDevice()
    {
        if (pendingDevices == null || currentIndex >= pendingDevices.Length) {
            Debug.Log("[APP] All devices configured");
            return;
        }

        currentDevice = spawner.SpawnUnconfiguredDevice(pendingDevices[currentIndex]);

        Debug.Log("[APP] Configuring: " + pendingDevices[currentIndex].name + " (" + pendingDevices[currentIndex].id + ")");
    }
}