using UnityEngine;

public class PendingDeviceFollower : MonoBehaviour
{
    private bool followCamera = true;
    private void Start()
    {
        Debug.Log($"[APP] PendingDeviceFollower attached to {gameObject.name}");
    }
    public void StopFollowing()
    {
        followCamera = false;
    }

    void LateUpdate()
    {
        if (!followCamera)
        {
            return;
        }

        Camera cam = Camera.main;

        if (cam == null)
        {
            return;
        }

        transform.position = cam.transform.position +  cam.transform.forward * 1.5f + cam.transform.up * -0.3f; ;
        Debug.Log( $"[APP] Following device: {gameObject.name}" );

    }
}