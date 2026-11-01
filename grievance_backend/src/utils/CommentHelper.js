const canAccess = (grievance ,user)=>{
    const isOwner = grievance.createdBy.equals(user._id)

    const isAssignedOfficer = grievance.assignedTo && grievance.assignedTo.equals(user._id)

    return isOwner||isAssignedOfficer||user.role==="admin";
}
// hide name if anonymous is true
const formatComment = (comment,grievance,viewer)=>{
    const data = comment.toObject()
    const writtenByOwner = comment.user._id.equals(grievance.createdBy)
    if(grievance.isAnonymous && writtenByOwner && viewer.role === "admin")
    {
        data.user = {name:"Anonymous",role:"student"}

    }
    return data

}

module.exports = {formatComment,canAccess}