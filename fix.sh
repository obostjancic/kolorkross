git filter-branch --commit-filter "
        if [ "$GIT_COMMITTER_NAME" = "ognjen-anyline" ];
        then
                GIT_COMMITTER_NAME="obostjancic";
                GIT_AUTHOR_NAME="obostjancic";
                GIT_COMMITTER_EMAIL="ognjen.bostjancic@gmail.com";
                GIT_AUTHOR_EMAIL="ognjen.bostjancic@gmail.com";
                git commit-tree "$@";
        else
                git commit-tree "$@";
        fi" HEAD