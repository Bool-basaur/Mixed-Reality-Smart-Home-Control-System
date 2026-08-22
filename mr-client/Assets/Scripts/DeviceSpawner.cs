using UnityEngine;

public class DeviceSpawner : MonoBehaviour
{
    public GameObject sensorPrefab;
    public GameObject actuatorPrefab;
    public GameObject hybridPrefab;

    private GameObject currentConfiguredDevice;


    public void SpawnConfiguredDevices(SpatialContext[] contexts){
        foreach (var context in contexts){
            if (context.spatialInformation != null &&
            context.spatialInformation.position != null &&
            context.spatialInformation.rotation != null){
                SpawnConfiguredDevice(context);
            }

        }
    }

    private GameObject GetPrefab(string category){
        switch (category)
        {
            case "sensor": return sensorPrefab;

            case "actuator": return actuatorPrefab;

            case "hybrid": return hybridPrefab;

            default: return sensorPrefab;
        }
    }
    private void SpawnConfiguredDevice(SpatialContext context){
        GameObject prefab = GetPrefab(context.entity.category);

        Vector3 position = context.spatialInformation.position.ToVector3();

        Quaternion rotation = context.spatialInformation.rotation.ToQuaternion();

        GameObject go = Instantiate(prefab, position, rotation);

        DeviceView view = go.GetComponent<DeviceView>();

        if (view != null) view.Setup(context);

    }

    public GameObject SpawnUnconfiguredDevice(UnconfiguredDevice device){
        Camera cam = Camera.main;

        Vector3 position = cam.transform.position + cam.transform.forward * 1.5f;

        GameObject prefab = GetPrefab(device.category);

        GameObject go = Instantiate(prefab, position, Quaternion.identity);

        ConfigurableDevice config = go.GetComponent<ConfigurableDevice>();

        config.Setup(device);

        currentConfiguredDevice = go;

        return go;
    }

    public GameObject GetCurrentConfiguredDevice(){
        return currentConfiguredDevice;
    }

    public void ClearCurrentConfiguredDevice(){
        if (currentConfiguredDevice != null)
        {
            Destroy(currentConfiguredDevice);
            currentConfiguredDevice = null;
        }
    }
}