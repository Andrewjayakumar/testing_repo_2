using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
//using IdentityServer4;
using Microsoft.Net.Http.Headers;
using SocialheitV2.Server.Extensions;
using System;
using System.Collections.Generic;

namespace SocialheitV2
{
  public class Startup
  {
    // Order or run
    //1) Constructor
    //2) Configure services
    //3) Configure

    private IHostingEnvironment _hostingEnv;
    public Startup(IHostingEnvironment env)
    {
      _hostingEnv = env;

      // Helpers.SetupSerilog();

      var builder = new ConfigurationBuilder()
                     .SetBasePath(env.ContentRootPath)
                     .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                     .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                     .AddEnvironmentVariables();
      if (env.IsDevelopment())
      {
        // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
        //builder.AddUserSecrets<Startup>();
      }

      Configuration = builder.Build();
    }

    public static IConfigurationRoot Configuration { get; set; }
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddPreRenderDebugging(_hostingEnv);
      services.AddOptions();
      services.AddResponseCompression(options =>
      {
        options.EnableForHttps = true;
        options.Providers.Add<GzipCompressionProvider>();
      });


      services.AddMemoryCache();

      services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

      services.AddCustomizedMvc();

      services.AddCors(options =>
      {
        options.AddPolicy("AllowAllHeaders",
              builder =>
              {
                builder.WithOrigins("http://localhost:4200", "https://metaluat.ascendion.com", "https://metaldev.ascendion.com")
                .AllowAnyMethod()
                .AllowAnyHeader();
              });
      });
      services.AddSession(options =>
      {
        // Set a short timeout for easy testing.
        options.IdleTimeout = TimeSpan.FromDays(1);
        options.Cookie.HttpOnly = true;

      });
      // Node services are to execute any arbitrary nodejs code from .net
      //services.AddNodeServices();
      //services.AddSpaStaticFiles(configuration =>
      //{
      //  configuration.RootPath = "wwwroot/dist";
      //});

    }
    public void Configure(IHostingEnvironment env, IApplicationBuilder app)
    {

      //app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions() { HotModuleReplacement = true });
      //app.AddDevMiddlewares();
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
        {
          HotModuleReplacement = true,
          HotModuleReplacementEndpoint = "/dist/__webpack_hmr",
          // HotModuleReplacementEndpoint = "__webpack_hmr",
          //ConfigFile = "webpack.config" + ".js"
          ConfigFile = "config/webpack.dev.js"
        });
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");
      }
      if (env.IsProduction())
      {
        app.UseResponseCompression();

        //app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
        //{

        //  HotModuleReplacementEndpoint = "/dist/__webpack_hmr",
        //  ConfigFile = "config/webpack.config.js"
        //});
      }

      app.UseCors("AllowAllHeaders");

      //app.UseXsrf();
      List<string> files = new List<string>();
      files.Add("Default.html");
      app.UseDefaultFiles(new DefaultFilesOptions
      {
        DefaultFileNames = files
      });
      app.UseStaticFiles(new StaticFileOptions
      {
        OnPrepareResponse = ctx =>
        {
          // const int durationInSeconds = 31536000;//60 * 60 * 24;
          // ctx.Context.Response.Headers[HeaderNames.CacheControl] =
          //     "public,max-age=" + durationInSeconds;
                  // ctx.Context.Response.Headers[HeaderNames.Cache-Control]  = "no-store";
                  // ctx.Context.Response.Headers[HeaderNames.Pragma] = "no-cache";
        }
      });

      app.UseIdentity();

      //Set cache control as no-store
      app.Use(async (context, next) =>
      {
        context.Response.Headers["Cache-Control"] = "no-store";
        context.Response.Headers["Pragma"] = "no-cache";
        await next();
      });


      // Add X-Content-Type-Options header
      app.Use(async (context, next) =>
      {
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        await next();
      });

      app.Use(async (context, next) =>
        {
            context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"; // 1 year
            context.Response.Headers["Referrer-Policy"] = "no-referrer"; // Or your desired policy

            await next();
        });

     // Add X-Frame - Options header
      app.Use(async (context, next) =>
      {
        context.Response.Headers.Add("X-Frame-Options", "DENY");
        await next();
      });

      app.Use(async (context, next) =>
      {
        //  context.Response.Headers.Add("Content-Security-Policy", "default-src 'self' https://*.ascendion.com localhost:* ws://localhost:* https://*.microsoft.com https://*.googletagmanager.com https://*.intercom.io;");
        //context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://widget.intercom.io https://www.google-analytics.com; style-src 'self' 'unsafe-inline'  ;");
        context.Response.Headers.Add("Content-Security-Policy",
            "default-src 'self'; " +
           // "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://widget.intercom.io https://www.google-analytics.com; " + // Add 'unsafe-eval' here
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://widget.intercom.io https://www.google-analytics.com https://js.intercomcdn.com; " + // Allow Intercom's CDN
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' *; " +
            "connect-src 'self' https://www.google-analytics.com http://localhost:4200 http://localhost:8600 http://localhost:8601 https://metaluat.ascendion.com:8600 https://metaluat.ascendion.com:8601 https://metaldev.ascendion.com:8600; " + // Allow API requests to all subdomains of ascension.com
            "font-src 'self'; " +
            "form-action 'self'; " +
            "frame-ancestors 'none';");
        await next();
      });

      // Add X-XSS-Protection header
      app.Use(async (context, next) =>
      {
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        await next();
      });

      //app.UseOpenIddict();


      //app.UseStaticFiles(new StaticFileOptions()
      //{
      //  FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot", "cdn")),
      //  RequestPath = new PathString("/cdn")
      //});


      app.UseOAuthProviders();
      app.UseSession();
      app.UseMvc(routes =>
      {
        // http://stackoverflow.com/questions/25982095/using-googleoauth2authenticationoptions-got-a-redirect-uri-mismatch-error
        // routes.MapRoute(name: "signin-google", template: "signin-google", defaults: new { controller = "Account", action = "ExternalLoginCallback" });


        routes.MapRoute(
        name: "default",
        template: "{controller=Default}/{action=Index}/{id?}");


        routes.MapSpaFallbackRoute(name: "spa-fallback", defaults: new { controller = "Home", action = "Index" });

      });
    }
  }
}
