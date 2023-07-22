import React, { useState, useEffect } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Stack } from "@phosphor-icons/react";
import './DashView.scss'

export default function DashView() {

    const [collections, setCollections] = useState([]);
    const [schema, setSchema] = useState({});
    const [timestamp, setTimestamp] = useState();
    const [schemaName, setSchemaName] = useState([]);

    useEffect(() => {
        async function getCollections() {
            let collections = await axios.get('http://localhost:8081/schemas')
            if (collections) {
                setCollections(collections.data) 
            }
        }
        getCollections()

    }, []);

    useEffect(() => {
        if(collections.length>0){
            readCollection(collections[0].name)
        }
    }, [collections]);

    function readCollection(name) {
        setSchemaName(name)
        const holdCollection = collections.find(item => item.name === name)
        const schema = holdCollection.schema[0]
        const updatedObject = {};
        Object.keys(schema).forEach((key, index) => {
          const item = schema[key];
          updatedObject[key] = {
            ...item,
            id: uuidv4() 
          };
        });
        setSchema(updatedObject)
        setTimestamp(holdCollection.schema[1].timestamps.toString())
    }


    function updateReq(name){
        let tempSchema = {...schema}
        tempSchema[name].required= !tempSchema[name].required ? true : !tempSchema[name].required
        setSchema(tempSchema)
    }

    function updateType(value,name){
        let tempSchema = {...schema}
        tempSchema[name].type=value
        setSchema(tempSchema)
    }

    function updateName(e,id){

        let tempSchema = {...schema}
        const updatedKey = e.target.value;
        const entryIndex = findEntryIndexById(tempSchema, id);

        const entries = Object.entries(tempSchema);
        const [key, value] = entries[entryIndex];
        const updatedEntries = [
            ...entries.slice(0, entryIndex),
            [updatedKey, value],
            ...entries.slice(entryIndex + 1)
        ];
        const updatedObject = Object.fromEntries(updatedEntries);

        setSchema(updatedObject)
    }

    const findEntryIndexById = (obj, targetId) => {
        const entries = Object.entries(obj);
        for (let i = 0; i < entries.length; i++) {
          const [key, value] = entries[i];
          if (value.id === targetId) {
            return i; // Return the index of the matching entry
          }
        }
        return -1; // If no matching entry is found
      };


    function updateDefault(e,name){
        let tempSchema = {...schema}
        tempSchema[name].default = e.target.value
        setSchema(tempSchema)
    }

    async function save(){
        const updatedObject = {};
        Object.keys(schema).forEach(key => {
          const { id, ...itemWithoutId } = schema[key];
          updatedObject[key] = itemWithoutId;
        });

        let finalModel=[
            updatedObject,
            {
                "timestamps": timestamp
            }
        ]
        console.log("Save");
        console.log(finalModel);
    }

    function addRow(){
        let newName = prompt("Name")
        if(!newName){return}
        let exists = schema[newName]
        if(exists){
            alert("Name must be unique")
            return
        }
        let tempSchema = {...schema}
        const newRow = {
            name:{
            type: 'String',
            required:false,
            default:''
        }}
        newRow[newName] = newRow.name;
        delete newRow.name;
        Object.assign(tempSchema,newRow)
        console.log(tempSchema);
        setSchema(tempSchema)
    }

    function deleteRow(name){
        let ask = window.confirm("Are you sure you wnat to delete: " + name)
        if(!ask){return}

        let tempSchema = {...schema}
        delete tempSchema[name]
        setSchema(tempSchema)
    }

    // useEffect(() => {
    //     console.log('scheama updated');
    // }, [schema]);


    return (
        <div className="mainView collectionView">
            <div className="collectionList">
               <div className="heading"> 
                     <Stack size={16} color="#1E2024" weight="bold" />
                    <h3>Collections</h3>
               </div>
                {collections.map((collection, index) => {
                    return (
                        <div className="buttonWrapper" key={'nav'+index}>
                            <button key={'collection' + index} className={schemaName === collection.name ? 'activeCollection' : ''} onClick={() => readCollection(collection.name)}>{collection.name}</button>
                        </div>
                    )
                })}
            </div>

            <div className="schemaInfo">
            <h3>{schemaName}</h3>
            {Object.keys(schema).length>0 &&
                <div>
                <table><thead><tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Default</th>
                    <th></th>
                </tr></thead>
                <tbody>
                    { Object.entries(schema).map(([property, attributes],index) => (
                       
                        <tr className="schemaRow" key={attributes.id}>
                            <td>
                                <input defaultValue={property} onChange={(e)=>updateName(e,attributes.id)} type="text"/>
                            </td>
                            <td>
                            <select value={attributes.type} onChange={(e)=>updateType(e.target.value,property)}>
                                <option value="String">String</option>
                                <option value="Number">Number</option>
                                <option value="Date">Date</option>
                                <option value="Buffer">Buffer</option>
                                <option value="Boolean">Boolean</option>
                                <option value="Mixed">Mixed</option>
                                <option value="ObjectId">ObjectId</option>
                                <option value="Array">Array</option>
                                <option value="Decimal128">Decimal128</option>
                                <option value="Map">Map</option>
                                <option value="Schema">Schema</option>
                                <option value="UUID">UUID</option>
                                <option value="BigInt">BigInt</option>
                            </select>
                            </td>
                            <td><input type="checkbox" checked={attributes.required ? attributes.required : false} onChange={()=>updateReq(property)}/></td>
                            <td> <input defaultValue={attributes.default} onChange={(e)=>updateDefault(e,property)}  type="text"/></td>
                            <td><button onClick={()=>deleteRow(property)}>Delete</button></td>
                        </tr>
                        
                   ))}
                </tbody></table>
                <div>Timestamps:{timestamp}</div>
               </div> 
            }
            <button onClick={()=>addRow()}>Add Row</button>
            <button onClick={()=>save()}>Update</button>
            </div>
        </div>
    );

}
