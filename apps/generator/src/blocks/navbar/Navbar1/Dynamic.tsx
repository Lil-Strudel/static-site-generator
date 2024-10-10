import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuItem,
  NavigationMenuItemLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "../../../components/ui/navigation-menu";

import type { ParentProps } from "solid-js";
import { For } from "solid-js";
import { Button } from "../../../components/ui/button";

const ListItem = (props: ParentProps<{ title: string; href: string }>) => {
  return (
    <NavigationMenuLink
      href={props.href}
      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline transition-[box-shadow,background-color] duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus:outline-none"
    >
      <NavigationMenuItemLabel class="text-sm font-medium leading-none">
        {props.title}
      </NavigationMenuItemLabel>
      <NavigationMenuDescription class="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {props.children}
      </NavigationMenuDescription>
    </NavigationMenuLink>
  );
};

const pages = [
  {
    title: "About",
    href: "/about-us",
    subRoutes: [
      {
        title: "What we do",
        href: "/about-us",
        description: "Lorem ipsom domir asdfjksjdfk sajdkfj sjdkf",
      },
      {
        title: "Accreditations",
        href: "/about-us",
        description: "Lorem ipsom domir asdjfjk asjdf j  jas a sdjfjkas djf",
      },
      {
        title: "Our Team",
        href: "/about-us",
        description: "Lorem ipsom domir jasd fjajsd j jsd fjasdf jj",
      },
      {
        title: "Blog",
        href: "/about-us",
        description: "Lorem ipsom domir asjdfjasd fjs",
      },
    ],
  },
  {
    title: "Services",
    href: "/services",
    subRoutes: [
      {
        title: "Residential Roofing",
        href: "/services",
        description: "Lorem ipsom domir",
      },
      {
        title: "Commercial Roofing",
        href: "/about-us",
        description: "Lorem ipsom domir",
      },
      { title: "Gutters", href: "/about-us", description: "Lorem ipsom domir" },
      { title: "Sliding", href: "/about-us", description: "Lorem ipsom domir" },
    ],
  },
  {
    title: "Financing",
    href: "/financing",
    subRoutes: [],
  },
  {
    title: "Service Areas",
    href: "/service-areas",
    subRoutes: [],
  },
];

export default function Dynamic() {
  return (
    <header class="bg-white">
      <nav
        class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img
              class="h-8 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <NavigationMenu>
            <For each={pages}>
              {(page) =>
                page.subRoutes.length ? (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      as="a"
                      class="transition-[box-shadow,background-color] data-[expanded]:bg-accent"
                      href={page.href}
                    >
                      {page.title}

                      <svg
                        class="h-5 w-5 flex-none text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent class="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
                      <For each={page.subRoutes}>
                        {(subRoute) => (
                          <ListItem href={subRoute.href} title={subRoute.title}>
                            {subRoute.description}
                          </ListItem>
                        )}
                      </For>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuTrigger
                    as="a"
                    class="transition-[box-shadow,background-color] data-[expanded]:bg-accent"
                    href={page.href}
                  >
                    {page.title}
                  </NavigationMenuTrigger>
                )
              }
            </For>
          </NavigationMenu>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button>Free Inspection</Button>
        </div>
      </nav>
      <div class="lg:hidden" role="dialog" aria-modal="true">
        <div class="fixed inset-0 z-10"></div>
        <div class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">Your Company</span>
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span class="sr-only">Close menu</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <div class="-mx-3">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    aria-controls="disclosure-1"
                    aria-expanded="false"
                  >
                    Product
                    <svg
                      class="h-5 w-5 flex-none"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <div class="mt-2 space-y-2" id="disclosure-1">
                    <a
                      href="#"
                      class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Analytics
                    </a>
                    <a
                      href="#"
                      class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Engagement
                    </a>
                    <a
                      href="#"
                      class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Security
                    </a>
                    <a
                      href="#"
                      class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Integrations
                    </a>
                    <a
                      href="#"
                      class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Automations
                    </a>
                    <a
                      href="#"
                      class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Watch demo
                    </a>
                    <a
                      href="#"
                      class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Contact sales
                    </a>
                  </div>
                </div>
                <a
                  href="#"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Features
                </a>
                <a
                  href="#"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>
              <div class="py-6">
                <a
                  href="#"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
