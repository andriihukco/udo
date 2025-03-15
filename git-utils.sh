#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
  echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to display help
show_help() {
  echo -e "${CYAN}U:DO Shop Git Utilities${NC}"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  status      Show git status"
  echo "  pull        Pull latest changes"
  echo "  push        Push changes to remote"
  echo "  commit      Commit changes with a message"
  echo "  branch      Create a new branch"
  echo "  checkout    Switch to a branch"
  echo "  merge       Merge a branch into current branch"
  echo "  log         Show commit history"
  echo "  diff        Show changes"
  echo "  stash       Stash changes"
  echo "  unstash     Apply stashed changes"
  echo "  help        Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 status                       # Show git status"
  echo "  $0 commit \"Fix header styling\"  # Commit changes with message"
  echo "  $0 branch feature/new-header    # Create a new branch"
  echo ""
}

# Check if git is installed
check_git() {
  if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git and try again."
    exit 1
  fi
}

# Check if git repository exists
check_git_repo() {
  if [ ! -d .git ]; then
    print_error "Not a git repository. Please run this script in a git repository."
    exit 1
  fi
}

# Show git status
show_status() {
  print_step "Showing git status..."
  git status
}

# Pull latest changes
pull_changes() {
  print_step "Pulling latest changes..."
  git pull
  
  if [ $? -eq 0 ]; then
    print_message "Successfully pulled latest changes."
  else
    print_error "Failed to pull latest changes."
  fi
}

# Push changes to remote
push_changes() {
  print_step "Pushing changes to remote..."
  git push
  
  if [ $? -eq 0 ]; then
    print_message "Successfully pushed changes to remote."
  else
    print_error "Failed to push changes to remote."
  fi
}

# Commit changes with a message
commit_changes() {
  if [ -z "$1" ]; then
    print_error "Please provide a commit message."
    exit 1
  fi
  
  print_step "Committing changes with message: $1"
  git add .
  git commit -m "$1"
  
  if [ $? -eq 0 ]; then
    print_message "Successfully committed changes."
  else
    print_error "Failed to commit changes."
  fi
}

# Create a new branch
create_branch() {
  if [ -z "$1" ]; then
    print_error "Please provide a branch name."
    exit 1
  fi
  
  print_step "Creating new branch: $1"
  git checkout -b "$1"
  
  if [ $? -eq 0 ]; then
    print_message "Successfully created and switched to branch: $1"
  else
    print_error "Failed to create branch: $1"
  fi
}

# Switch to a branch
checkout_branch() {
  if [ -z "$1" ]; then
    print_error "Please provide a branch name."
    exit 1
  fi
  
  print_step "Switching to branch: $1"
  git checkout "$1"
  
  if [ $? -eq 0 ]; then
    print_message "Successfully switched to branch: $1"
  else
    print_error "Failed to switch to branch: $1"
  fi
}

# Merge a branch into current branch
merge_branch() {
  if [ -z "$1" ]; then
    print_error "Please provide a branch name to merge."
    exit 1
  fi
  
  print_step "Merging branch $1 into current branch..."
  git merge "$1"
  
  if [ $? -eq 0 ]; then
    print_message "Successfully merged branch: $1"
  else
    print_error "Failed to merge branch: $1"
  fi
}

# Show commit history
show_log() {
  print_step "Showing commit history..."
  git log --oneline --graph --decorate --all -n 10
}

# Show changes
show_diff() {
  print_step "Showing changes..."
  git diff
}

# Stash changes
stash_changes() {
  print_step "Stashing changes..."
  git stash
  
  if [ $? -eq 0 ]; then
    print_message "Successfully stashed changes."
  else
    print_error "Failed to stash changes."
  fi
}

# Apply stashed changes
unstash_changes() {
  print_step "Applying stashed changes..."
  git stash apply
  
  if [ $? -eq 0 ]; then
    print_message "Successfully applied stashed changes."
  else
    print_error "Failed to apply stashed changes."
  fi
}

# Main function
main() {
  # Check if git is installed
  check_git
  
  # Check if command is provided
  if [ $# -eq 0 ]; then
    show_help
    exit 0
  fi
  
  # Check if git repository exists
  check_git_repo
  
  # Parse command
  COMMAND=$1
  shift
  
  case $COMMAND in
    status)
      show_status
      ;;
    pull)
      pull_changes
      ;;
    push)
      push_changes
      ;;
    commit)
      commit_changes "$1"
      ;;
    branch)
      create_branch "$1"
      ;;
    checkout)
      checkout_branch "$1"
      ;;
    merge)
      merge_branch "$1"
      ;;
    log)
      show_log
      ;;
    diff)
      show_diff
      ;;
    stash)
      stash_changes
      ;;
    unstash)
      unstash_changes
      ;;
    help)
      show_help
      ;;
    *)
      print_error "Unknown command: $COMMAND"
      show_help
      exit 1
      ;;
  esac
}

# Run main function with all arguments
main "$@" 