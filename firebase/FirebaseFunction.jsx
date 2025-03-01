import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";

const col_input = collection(db,"ProjectInputs")
export async function addInput(value){
    // console.log(value);
    await addDoc(col_input, value);
}

export async function updateInput(value){
    let {sid, ...obj} = value;
    // console.log(sid);
    await updateDoc(doc(db, 'ProjectInputs',sid), obj)
}

export async function addGetValue(){
    let snapshot = await getDocs(col_input);
    let v = []
    snapshot.forEach((val)=>{
        v.push({sid: val.id, ...val.data()});
    })

    console.log(v)
    return v;
}

export async function deleteInput(sid){
    // let {sid, ...obj} = value;
    console.log(sid)
    await deleteDoc(doc(db, 'ProjectInputs', sid))
}