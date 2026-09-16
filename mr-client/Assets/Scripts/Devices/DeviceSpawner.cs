using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using System;

public class DeviceSpawner : MonoBehaviour
{
    public GameObject sensorPrefab;
    public GameObject actuatorPrefab;
    public GameObject hybridPrefab;

    [SerializeField]
    private GameObject configuredPanelPrefab;

    [SerializeField]
    private GameObject unconfiguredPanelPrefab; 
    
    [SerializeField]
    private ApiClient apiClient;

    private GameObject currentConfiguredDevice;

    private Dictionary<string, ConfiguredDevice> configuredDevices = new Dictionary<string, ConfiguredDevice>();

    private ARAnchorManager anchorManager;

    private void Start()
    {
        anchorManager = FindFirstObjectByType<ARAnchorManager>();

        apiClient = FindFirstObjectByType<ApiClient>();
    }
    private GameObject GetPrefab(string category)
    {
        switch (category)
        {
            case "sensor": return sensorPrefab;

            case "actuator": return actuatorPrefab;

            case "hybrid": return hybridPrefab;

            default: return sensorPrefab;
        }
    }

    private async void SpawnConfiguredDevice(IoTEntity entity, SpatialInformation spatialInfo)
    {
        GameObject prefab = GetPrefab(entity.category);

        Vector3 position;
        Quaternion rotation;
        ARAnchor anchor = null;
        SerializableGuid serializableGuid = SerializableGuid.empty;

        if (!string.IsNullOrEmpty(spatialInfo.anchorId))
        {

            try
            {

                Guid guid = new Guid(spatialInfo.anchorId);

                serializableGuid = new SerializableGuid(guid);

                var loadResult = await anchorManager.TryLoadAnchorAsync(serializableGuid );

                if (loadResult.status.IsSuccess() && loadResult.value != null)
                {
                    anchor = loadResult.value;

                    position = anchor.transform.position;

                    rotation = anchor.transform.rotation; 

                    Debug.Log( "[ANCHOR] Loaded: " + spatialInfo.anchorId);
                }
                else
                {
                    Debug.LogWarning("[ANCHOR] Failed to load. Using stored transform.");

                    position = spatialInfo.position.ToVector3();

                    rotation = spatialInfo.rotation.ToQuaternion();
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning( "[ANCHOR] Exception loading anchor: " + e.Message);

                position = spatialInfo.position.ToVector3();

                rotation = spatialInfo.rotation.ToQuaternion();
            }
        }
        else
        {
            position = spatialInfo.position.ToVector3();

            rotation = spatialInfo.rotation.ToQuaternion();
        }

        GameObject go = Instantiate(prefab, position ,rotation);
        if(anchor != null) go.transform.SetParent(anchor.transform, true);
        else go.transform.SetPositionAndRotation(position, rotation);

        DeviceView view = go.GetComponent<DeviceView>();

        if (view != null) {
            view.Setup(entity);
        }

        ConfiguredDevice configured = go.AddComponent<ConfiguredDevice>();

        DeviceReanchorHandler reanchor = go.AddComponent<DeviceReanchorHandler>();

        reanchor.Initialize(configured, apiClient, anchor, serializableGuid);

        configured.Initialize(configuredPanelPrefab);

        configured.Setup(entity);

        configuredDevices[entity.id] = configured;
    }

    public GameObject SpawnUnconfiguredDevice(UnconfiguredDevice device){
        Camera cam = Camera.main;

        Vector3 pos = cam.transform.position + cam.transform.forward * 0.5f + cam.transform.up * -0.3f;

        Quaternion rot = cam.transform.rotation * Quaternion.Euler(0f, 180f, 0f);

        GameObject prefab = GetPrefab(device.category);

        GameObject go = Instantiate(prefab, pos, rot);

        PendingConfigurationDevice pending = go.AddComponent<PendingConfigurationDevice>();
        Debug.Log($"[APP] SPAWNING UNCONFIGURED: {device.name}");
        pending.Initialize(unconfiguredPanelPrefab);

        pending.Setup(device);

        currentConfiguredDevice = go;

        return go;
    }

    public GameObject GetCurrentConfiguredDevice()
    {
        return currentConfiguredDevice;
    }

    public void ClearCurrentConfiguredDevice()
    {
        if (currentConfiguredDevice != null)
        {
            Destroy(currentConfiguredDevice);
            currentConfiguredDevice = null;
        }
    }

    public void UpdateOrSpawnDevices(SpatialContext[] contexts)
    {
        foreach (var context in contexts)
        {
            if (context.spatialInformation == null || context.spatialInformation.position == null ||
                context.spatialInformation.rotation == null)
            {
                continue;
            }

            IoTEntity entity = context.entity;

            SpatialInformation spatialInfo = context.spatialInformation;

            if (
                configuredDevices.TryGetValue(entity.id, out ConfiguredDevice existing)
            )
            {
                UpdateDevice(existing, entity, spatialInfo);
            }
            else
            {
                SpawnConfiguredDevice(entity, spatialInfo);
            }
        }

        RemoveMissingDevices(contexts);
    }

    private void UpdateDevice(ConfiguredDevice device, IoTEntity entity, SpatialInformation spatialInfo)
    {
        device.UpdateEntity(entity);

        DeviceView view = device.GetComponent<DeviceView>();

        if (view != null)
        {
            view.Setup(entity);
        }
    }



    private void RemoveMissingDevices(SpatialContext[] contexts)
    {
        HashSet<string> validIds = new HashSet<string>(contexts.Select(c => c.entity.id));

        List<string> devicesToRemove = configuredDevices.Keys.Where(id =>!validIds.Contains(id)).ToList();

        foreach (string id in devicesToRemove)
        {
            Destroy(configuredDevices[id].gameObject);

            configuredDevices.Remove(id);
        }
    }
}