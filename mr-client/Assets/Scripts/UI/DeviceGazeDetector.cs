using UnityEngine;

public class DeviceGazeDetector : MonoBehaviour
{
    [SerializeField]
    private float maxDistance = 20f;

    private ConfiguredDevice currentDevice;

    private void Update()
    {
        Ray ray = new Ray(transform.position, transform.forward);

        if (Physics.SphereCast(ray, 0.1f, out RaycastHit hit, maxDistance)) {
            ConfiguredDevice device = hit.collider.GetComponentInParent<ConfiguredDevice>();

            if (device != null && hit.collider.CompareTag("DigitalTwinDevice")){
                if (currentDevice != device)
                {
                    HideCurrentDevice();

                    currentDevice = device;

                    Debug.Log($"[APP] GAZE DETECTED: {device.name}");

                    currentDevice.ShowInfoPanel();
                }

                return;
            }
        }

    }

    private void HideCurrentDevice()
    {
        if (currentDevice != null)
        {
            currentDevice.HideInfoPanel();
            currentDevice = null;
        }
    }
}