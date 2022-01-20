![Logo](https://raw.githubusercontent.com/obostjancic/kolorkross/main/assets/kolorkross.png)

<div align="center">

A VS Code extension that allows you to organize and access your projects in a color-coded way.

</div>

<div align="center" display="inline">

![VSCode Marketplace](https://vsmarketplacebadge.apphb.com/version/obostjancic.kolorkross.svg?color=blue&style=?style=for-the-badge&logo=visual-studio-code)
[![GitHub license](https://img.shields.io/github/license/obostjancic/kolorkross)](https://github.com/obostjancic/kolorkross/blob/main/LICENSE.md)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/obostjancic/kolorkross.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/obostjancic/kolorkross/context:javascript)
[![codecov](https://codecov.io/gh/obostjancic/kolorkross/branch/main/graph/badge.svg?token=Y8KHCMX7PF)](https://codecov.io/gh/obostjancic/kolorkross)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/obostjancic/kolorkross/main)
![GitHub issues](https://img.shields.io/github/issues/obostjancic/kolorkross)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/obostjancic/kolorkross)

</div>

## Installation

To begin, you can get the extension from the **[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=obostjancic.kolorkross)** or by opening the Extensions side bar panel in Visual Studio Code and selecting the menu options for **View → Extensions** and searching for **Kolor Kross**.

## Features

Kolor Kross organizes projects (workspaces) into flexible groups. Every project is assigned a random color on creation. This allows users to develop mental maps when working across multiple projects. The Dasboard offers a quick overview and organization of all projects and their color codes. It also allows users to quickly jump into a project.

To Add a project to a group, simply click on the **+ Add Project** button.

![Add Project](https://raw.githubusercontent.com/obostjancic/kolorkross/main/assets/add_project.gif)

You can change the color of the project, as well as the project name and path, by clicking on the **edit** icon.

![Edit Project](https://raw.githubusercontent.com/obostjancic/kolorkross/main/assets/edit_project.gif)

To navigate to a project, simply click anywhere on the project row in the dashboard. Vs Code will open the project in a new window that is colored with the project color.

![Open Project](https://raw.githubusercontent.com/obostjancic/kolorkross/main/assets/open_project.gif)

## Release Notes

### 0.3.0

- Implemented migration service
- Added feature to move projects up or down within a group
- Added feature to move groups up or down on the dashboard

### 0.2.0

- Added CI release process
- Added more colors to the color palette
- Exchanged `typedi` for `tsyringe`
- Restyled window colors

### 0.1.0

Initial release of Kolor Kross.
