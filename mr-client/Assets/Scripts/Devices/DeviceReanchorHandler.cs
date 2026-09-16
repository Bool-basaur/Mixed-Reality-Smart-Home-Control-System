using System;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using UnityEngine.XR.Interaction.Toolkit;
using UnityEngine.XR.Interaction.Toolkit.Interactables;

public class DeviceReanchorHandler : MonoBehaviour
{
    private XRGrabInteractable grab;

    private ARAnchorManager anchorManager;

    private ConfiguredDevice configuredDevice;

    private ApiClient apiClient;

    private ARAnchor currentAnchor; 

    private SerializableGuid currentAnchorId;

    public void Initialize(
     ConfiguredDevice configuredDevice,
     ApiClient apiClient,
     ARAnchor currentAnchor,
     SerializableGuid currentAnchorId)
    {
        this.configuredDevice = configuredDevice;
        this.apiClient = apiClient;
        this.currentAnchor = currentAnchor;
        this.currentAnchorId = currentAnchorId;
    }

    private void Awake()
    {
        grab = GetComponent<XRGrabInteractable>();
        anchorManager = FindFirstObjectByType<ARAnchorManager>();
    }

    private void OnEnable()
    {
        grab.selectExited.AddListener(OnReleased);
    }

    private void OnDisable()
    {
        grab.selectExited.RemoveListener(OnReleased);
    }

    private async void OnReleased(SelectExitEventArgs args)
    {
        Debug.Log("[ANCHOR] Device released");

        try
        {
            if (currentAnchor != null)
            {
                await anchorManager.TryEraseAnchorAsync(currentAnchorId);

                currentAnchor = null;
            }
            transform.SetParent(null, true);

            Pose pose = new Pose(transform.position,transform.rotation);
            var anchorResult = await anchorManager.TryAddAnchorAsync(pose);

            if (!anchorResult.status.IsSuccess() || anchorResult.value == null)
            {
                Debug.LogError("[ANCHOR] Failed to create new anchor");

                return;
            }

            var saveResult = await anchorManager.TrySaveAnchorAsync(anchorResult.value);

            if (!saveResult.status.IsSuccess())
            {
                Debug.LogError(
                    "[ANCHOR] Failed to save new anchor"
                );

                return;
            }

            ARAnchor newAnchor = anchorResult.value;

            currentAnchor = newAnchor;
            currentAnchorId = saveResult.value;

            transform.SetParent(newAnchor.transform, true);

            SpatialInformationRequest request = new SpatialInformationRequest();

            request.entityId = configuredDevice.EntityId;

            request.homeId = "main-home";
            request.roomId = "main-room";
            request.zoneId = "main-zone";

            request.anchorId =
                saveResult.value.guid.ToString();

            request.position =
                new Position
                {
                    x = transform.position.x,
                    y = transform.position.y,
                    z = transform.position.z
                };

            Vector3 euler =
                transform.rotation.eulerAngles;

            request.rotation = new Rotation
                {
                    x = euler.x,
                    y = euler.y,
                    z = euler.z
                };

            // 6. Persistir en backend
            apiClient.SaveSpatialInformation(request,() =>
                {
                    Debug.Log("[ANCHOR] Anchor updated successfully");
                }
            );
        }
        catch (Exception e)
        {
            Debug.LogError(
                "[ANCHOR] Re-anchor failed: " +
                e.Message
            );
        }
    }
}