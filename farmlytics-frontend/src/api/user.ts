import API from "@/api/axios";
import {RoleStatsResponse} from "@/lib/types";

export const userService =  {
   

    roleStats: async () => {
        const response = await API.get<RoleStatsResponse>("/users/stats/roles");
        return response.data;
    },

  

}