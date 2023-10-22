namespace Microsoft.eShopOnContainers.Services.Identity.API.Services
{
    public interface IProfileQueries
    {
        Task<ApplicationUser> UpdateProfile(ApplicationUser user);

    }
}
