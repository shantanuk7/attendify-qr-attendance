import GroupForm from "@/components/admin/GroupForm";
import GroupTable from "@/components/admin/GroupTabel";
import React from "react";

const Group = () => {
  return (
    <div>
      <div>
        <GroupForm />
      </div>
      <div>
        <GroupTable />
      </div>
    </div>
  );
};

export default Group;
