#!/bin/bash
REPO=$HOME/LourahJsFramework
cd $LOURAH/LourahJsFramework
find . -depth -type f -newer $HOME/LourahJsFramework/.git/COMMIT_EDITMSG -print | cpio -pvmu $REPO
