namespace Microsoft.eShopOnContainers.Services.Identity.API.Services
{
    public class ProfileQueries : IProfileQueries
    {
        private string _connectionString = string.Empty;
        public ProfileQueries(string constr)
        {
            _connectionString = !string.IsNullOrWhiteSpace(constr) ? constr : throw new ArgumentNullException(nameof(constr));
        }
        public async Task<ApplicationUser> UpdateProfile(ApplicationUser user)
        {
            var config = new ConfigurationBuilder()
               .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
               .AddJsonFile("appsettings.json")
               .AddEnvironmentVariables()
               .Build();
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            var result = await connection.QueryAsync<dynamic>(
            @"UPDATE AspNetUsers
                SET Street = @street, City = @city, State = @state, Country = @country, CardNumber = @cardNo, CardHolderName = @cardHolderName, Expiration = @expiration, SecurityNumber = @sercurityNo
                where ID = @id
                SELECT * FROM AspNetUsers where ID = @id"
                , new { id = user.Id, street = user.Street, city = user.City, state = user.State, country = user.Country, cardNo = user.CardNumber, cardHolderName = user.CardHolderName, expiration = user.Expiration, sercurityNo = user.SecurityNumber }
            );

            return MapApplicationUsers(result);
        }

        private ApplicationUser MapApplicationUsers(dynamic result)
        {
            var user = new ApplicationUser
            {
                CardNumber = result[0].CardNumber,
                CardHolderName = result[0].CardHolderName,
                Expiration = result[0].Expiration,
                State = result[0].State,
                Street = result[0].Street,
                City = result[0].City,
                ZipCode = result[0].ZipCode,
                Country = result[0].Country,
                SecurityNumber = result[0].SercurityNumber
            };
            return user;
        }
    }
}
