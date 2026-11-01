const Anonyomous = (grieveance,viewer)=>{
    const data = grieveance.toObject()
    
    if(data.isAnonymous&&viewer.role==="officer"){
        data.createdBy = "Anontomous"
    }

    return data


}

module.exports = Anonyomous
