using System;
using System.Linq;
using Section15.DbContexts;
using Section15.Models;

namespace Section15.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        User GetById(int id);
    }

    public class UserService : IUserService
    {
        private ChiuDbContext context;

        public UserService(ChiuDbContext context)
        {
            this.context = context;
        }

        public User Authenticate(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
                return null;

            var user = context.Users.SingleOrDefault(x => x.UserName == userName);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!string.Equals(password, user.Password))
                return null;

            // authentication successful
            return user;
        }

        public User GetById(int id)
        {
            return context.Users.Find(id);
        }
    }
}
