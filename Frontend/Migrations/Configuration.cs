using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace App.Frontend.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<App.Frontend.ExampleContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }
        private bool AddUser(ExampleContext context)
        {
            IdentityResult identityResult;
            UserManager<IdentityUser> userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(context));
            var user = new IdentityUser()
            {
                UserName = "admin"
            };
            if (userManager.FindByName(user.UserName) != null)
            {
                return true;
            }
            identityResult = userManager.Create(user, "password");
            return identityResult.Succeeded;
        }
        protected override void Seed(ExampleContext context)
        {
            AddUser(context);
        }
    }
}
