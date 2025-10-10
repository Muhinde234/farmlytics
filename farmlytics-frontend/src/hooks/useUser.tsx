import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { RoleStatsResponse} from "@/lib/types";
import {userService} from "@/api/user";




export const useRoleStats = () => {
    return useQuery<RoleStatsResponse>({
        queryKey: ["roleStats"],
        queryFn: userService.roleStats
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation< Error>({
       
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users"] });
            await queryClient.invalidateQueries({ queryKey: ["roleStats"] });
        }
    });
};