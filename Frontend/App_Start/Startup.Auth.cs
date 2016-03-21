// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Startup.Auth.cs" company="">
//   Copyright © 2015 
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;

namespace App.Frontend
{
    using Microsoft.AspNet.Identity;
    using Microsoft.Owin;
    using Microsoft.Owin.Security.Cookies;
    using Owin;

    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }
        public static Func<UserManager<IdentityUser>> UserManagerFactory { get; set; }

        static Startup()
        {
            String PublicClientId = "self";
            UserManagerFactory = () => new UserManager<IdentityUser>(new UserStore<IdentityUser>(new ExampleContext()));
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/token"),
                Provider = new ApplicationOAuthProvider(PublicClientId, UserManagerFactory),
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(24),
                AllowInsecureHttp = true
            };
        }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseOAuthBearerTokens(OAuthOptions);
            // Enable the application to use a cookie to store information for the signed in user
            //app.UseCookieAuthentication(new CookieAuthenticationOptions
            //{
            //    AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
            //    LoginPath = new PathString("/login")
            //});

            //// Use a cookie to temporarily store information about a user logging in with a third party login provider
            //app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            //// Uncomment the following lines to enable logging in with third party login providers
            ////app.UseMicrosoftAccountAuthentication(
            ////    clientId: "",
            ////    clientSecret: "");

            ////app.UseTwitterAuthentication(
            ////   consumerKey: "",
            ////   consumerSecret: "");

            ////app.UseFacebookAuthentication(
            ////   appId: "",
            ////   appSecret: "");

            ////app.UseGoogleAuthentication();
        }
    }
}
