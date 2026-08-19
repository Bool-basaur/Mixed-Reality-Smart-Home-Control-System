using UnityEngine;

public class DeviceSpawner : MonoBehaviour
{
    public GameObject devicePrefab;

    public void SpawnContexts(SpatialContext[] contexts){
        Camera cam = FindFirstObjectByType<Camera>();

        float spacing = 0.5f;

        for (int i = 0; i < contexts.Length; i++){
            SpatialContext context = contexts[i];

            Vector3 spawnPosition;

            if (context.spatialInformation != null && context.spatialInformation.position != null){
                spawnPosition = context.spatialInformation.position.ToVector3();
                Debug.Log("[APP] Using saved position: " + spawnPosition);
            }
            else{
                Vector3 basePosition = cam.transform.position + cam.transform.forward * 1.5f;

                Vector3 offset = cam.transform.right * (i * spacing);

                spawnPosition = basePosition + offset;

                Debug.Log("[APP] Using fallback position");
            }

            Quaternion rotation = Quaternion.identity;

            if ( context.spatialInformation != null && context.spatialInformation.rotation != null){
                rotation = context.spatialInformation.rotation.ToQuaternion();
            }

            GameObject go = Instantiate(devicePrefab, spawnPosition, rotation);

            go.transform.localScale = Vector3.one * 0.3f;

            DeviceView view = go.GetComponent<DeviceView>();

            if (view != null){
                view.Setup(context);
            }
        }
    }
}