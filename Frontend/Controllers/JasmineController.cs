using System;
using System.Web.Mvc;

namespace App.Frontend.Controllers
{
    public class JasmineController : Controller
    {
        public ViewResult Run()
        {
            return View("SpecRunner");
        }
    }
}
