import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./FirebaseConfig";

const col_input = collection(db,"ProjectInputs")
export async function addInput(value){
    // console.log(value);
    await addDoc(col_input, value);
}

export async function addGetValue(){
    let snapshot = await getDocs(col_input);
    let v = []
    snapshot.forEach((val)=>{
        v.push(val.data());
    })

    console.log(v)
    return v;
}