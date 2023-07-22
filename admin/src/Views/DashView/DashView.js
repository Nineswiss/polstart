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
        console.log(holdCollection.schema[0]);
        setSchema(holdCollection.schema[0])
        console.log(holdCollection.schema[1].timestamps);
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
    function updateName(name){

    }

    async function save(){
        let finalModel=[
            schema,
            {
                "timestamps": timestamp
            }
        ]
        console.log("Save");
        console.log(finalModel);
    }

    function addRow(){
        console.log("Add");
        let tempSchema = {...schema}
        const newRow = {
            name:{
            type: 'String',
            required:false,
            default:''
        }}
        const newName = uuidv4()
        newRow[newName] = newRow.name;
        delete newRow.name;
        console.log(newRow);
        Object.assign(tempSchema,newRow)
        console.log(tempSchema);
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
                       
                        <tr className="schemaRow" key={'dec'+index}>
                            <td>
                                <input defaultValue={property} onChange={updateName()}/>
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
                            <td><input type="checkbox" checked={attributes.required} onChange={()=>updateReq(property)}/></td>
                            <td>{attributes.default}</td>
                            <td><button>Delete</button></td>
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
