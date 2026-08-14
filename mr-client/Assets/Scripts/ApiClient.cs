using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Collections;

public class ApiClient : MonoBehaviour
{
    public string baseUrl = "http://192.168.1.42:3000";

    public void GetSnapshot(Action<Snapshot> onSuccess){
        StartCoroutine( GetSnapshotCoroutine(onSuccess));
    }

    IEnumerator GetSnapshotCoroutine(Action<Snapshot> onSuccess){
        string url = baseUrl + "/snapshot";

        Debug.Log("[APP] Calling: " + url);

        UnityWebRequest request = UnityWebRequest.Get(url);

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success){
            Debug.LogError("[APP] ERROR: " + request.error);
            yield break;
        }

        string json =  request.downloadHandler.text;

        Debug.Log( "[APP] Snapshot received:\n" + json);

        Snapshot snapshot =  JsonUtility.FromJson<Snapshot>(json);

        onSuccess?.Invoke(snapshot);
    }
}