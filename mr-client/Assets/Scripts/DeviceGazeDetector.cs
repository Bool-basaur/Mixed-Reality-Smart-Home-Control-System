using System.Collections;
using UnityEngine;
using UnityEngine.EventSystems;

public class DeviceGazeDetector : MonoBehaviour
{
    [SerializeField]
    private float maxDistance = 8f;
    
    private ConfiguredDevice currentDevice;
    
    private Coroutine hideCoroutine;


    private void Update() {

        if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(-1)){           
            return;          
        }
        Ray ray = new Ray(transform.position, transform.forward);

        if (Physics.SphereCast(ray, 0.1f, out RaycastHit hit,  maxDistance)) {
            ConfiguredDevice device = hit.collider.GetComponentInParent<ConfiguredDevice>();
            if (device != null && hit.collider.CompareTag("DigitalTwinDevice"))
            {

                if (hideCoroutine != null)
                {
                    StopCoroutine(hideCoroutine);
                    hideCoroutine = null;
                }

                if (currentDevice != device)
                {
                    HideCurrentDevice();

                    currentDevice = device;
                    if (device != null)
                    {
                        Debug.Log($"[APP] GAZE DETECTED: {device.name}");
                    }
                    currentDevice.ShowInfoPanel();
                }

                return;
            }
        }

        StartHideCountdown();
    }

    private void HideCurrentDevice()
    {
        if (currentDevice != null)
        {
            currentDevice.HideInfoPanel();
            currentDevice = null;
        }
    }
    private void StartHideCountdown()
    {
        if (currentDevice == null)
        {
            return;
        }

        if (hideCoroutine == null)
        {
            hideCoroutine = StartCoroutine(HideAfterDelay());
        }
    }

    private IEnumerator HideAfterDelay()
    {
        yield return new WaitForSeconds(1f);

        currentDevice?.HideInfoPanel();
        currentDevice = null;

        hideCoroutine = null;
    }
}