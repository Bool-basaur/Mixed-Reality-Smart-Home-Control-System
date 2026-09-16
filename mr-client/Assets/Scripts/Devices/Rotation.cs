using UnityEngine;
using System;

[Serializable]
public class Rotation
{
    public float x;
    public float y;
    public float z;

    public Quaternion ToQuaternion()
    {
        return Quaternion.Euler(x, y, z);
    }
}