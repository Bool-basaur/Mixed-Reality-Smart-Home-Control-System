using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Collections;

public class ApiClient : MonoBehaviour
{
    public static string baseUrl = "http://192.168.1.40:3000";
    private static string spatialPath = "/spatial";
    private static string spatialContextsPath = "/spatial-contexts";
    private static string unconfiguredDevices = baseUrl + spatialPath + spatialContextsPath + "/unconfigured";
    private static string spatialInformationUrl = baseUrl + spatialPath + "/spatial-information";
    private static string spatialContextsUrl = baseUrl + spatialPath + spatialContextsPath;

    public void GetSpatialContexts(
    Action<SpatialContext[]> onSuccess)
    {
        StartCoroutine(
            GetSpatialContextsCoroutine(
                onSuccess
            )
        );
    }

    IEnumerator GetSpatialContextsCoroutine(Action<SpatialContext[]> onSuccess) {
        Debug.Log("[APP] Calling: " + spatialContextsUrl);

        UnityWebRequest request = UnityWebRequest.Get(spatialContextsUrl);

        yield return request.SendWebRequest();

        if (request.result !=
            UnityWebRequest.Result.Success)
        {
            Debug.LogError("[APP] ERROR: " + request.error);

            yield break;
        }

        string json =
            request.downloadHandler.text;

        Debug.Log("[APP] Spatial contexts received:\n" + json);

        SpatialContext[] contexts = JsonArrayHelper.FromJson<SpatialContext>(json);

        onSuccess?.Invoke(contexts);
    }

    public void GetUnconfiguredDevices(Action<UnconfiguredDevice[]> onSuccess){
        StartCoroutine(GetUnconfiguredDevicesCoroutine(onSuccess));
    }

    IEnumerator GetUnconfiguredDevicesCoroutine(Action<UnconfiguredDevice[]> onSuccess){

        Debug.Log("[APP] Calling: " + unconfiguredDevices);

        UnityWebRequest request = UnityWebRequest.Get(unconfiguredDevices);

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success){
            Debug.LogError("[APP] ERROR: " + request.error);
            yield break;
        }

        string json = request.downloadHandler.text;

        UnconfiguredDevice[] devices = JsonArrayHelper.FromJson<UnconfiguredDevice>(json);

        onSuccess?.Invoke(devices);
    }

    public void SaveSpatialInformation(SpatialInformationRequest request, Action onSuccess){
        StartCoroutine(SaveSpatialInformationCoroutine(request, onSuccess));
    }

    IEnumerator SaveSpatialInformationCoroutine(SpatialInformationRequest request, Action onSuccess){
 
        string json = JsonUtility.ToJson(request);

        Debug.Log("[APP] Saving spatial information:\n" + json);

        UnityWebRequest webRequest = new UnityWebRequest(spatialInformationUrl, "POST");

        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);

        webRequest.uploadHandler = new UploadHandlerRaw(bodyRaw);

        webRequest.downloadHandler = new DownloadHandlerBuffer();

        webRequest.SetRequestHeader("Content-Type", "application/json");

        yield return webRequest.SendWebRequest();

        if (webRequest.result != UnityWebRequest.Result.Success) {
            Debug.LogError("[APP] ERROR saving spatial information: " + webRequest.error);
            yield break;
        }

        Debug.Log("[APP] Spatial information saved");

        onSuccess?.Invoke();
    }
}