using System;
using System.Collections.Generic;

[Serializable]
public class IoTEntity
{
    public string id;
    public string name;
    public string category;
    public string mainState;

    public List<string> capabilities;
    public List<string> actions;
    public List<string> relations;

    public IoTEntity()
    {
    }
}