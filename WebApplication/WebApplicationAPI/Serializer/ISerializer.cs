using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Serializer
{
    public interface ISerializer<T>
    {
        string Serialize(T obj);
    }
}
