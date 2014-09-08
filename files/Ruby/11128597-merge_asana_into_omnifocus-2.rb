#!/usr/bin/env ruby

# merge_asana_into_omnifocus.rb
# Hilton Lipschitz
# http://www.hiltmon.com
# Use and modify freely, attribution appreciated

# Script to import Asana projects and their tasks into
# OmniFocus and keep them up to date from Asana.

require "rubygems"
require "JSON"
require "net/https"

class MergeAsanaIntoOmnifocus
  
  API_KEY = '<INSERT YOUR ASANA API KEY>'
  ASIGNEE_NAME = '<INSERT YOUR ASANA PROFILE NAME EXACTLY>'
  SUBTASKS = true

  def get_json_data(url_string)
    # set up HTTPS connection
    uri = URI.parse(url_string)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER

    # set up the request
    header = {
      "Content-Type" => "application/json"
    }

    req = Net::HTTP::Get.new(uri, header)
    req.basic_auth(API_KEY, '')

    # issue the request
    res = http.start { |http| http.request(req) }

    # Parse the result
    body = JSON.parse(res.body)

    if body['errors'] then
      puts "Server returned an error: #{body['errors'][0]['message']}"
      return nil
    end
  
    body
  end
  
  # -----------------------------------------------------------------------
  # ASANA API Calls
  # -----------------------------------------------------------------------

  def get_projects
    body = get_json_data("https://app.asana.com/api/1.0/projects")
    projects = {}
    body["data"].each do |element|
      projects[element["id"]] = element["name"].gsub("'", '').gsub("\n", '')
    end
  
    projects
  end

  # NOTE: Assignee = me is ignored in projects filter
  def get_tasks_in_project(project_id)
    body = get_json_data("https://app.asana.com/api/1.0/tasks?project=#{project_id}&assignee=me")
    tasks = {}
    body["data"].each do |element|
      tasks[element["id"]] = element["name"].gsub("'", '').gsub("\n", '')
    end

    tasks
  end

  def get_subtasks_in_task(task_id)
    body = get_json_data("https://app.asana.com/api/1.0/tasks/#{task_id}/subtasks")
    body["data"]
  end

  def get_project_detail(project_id)
    body = get_json_data("https://app.asana.com/api/1.0/projects/#{project_id}")
    body["data"]
  end

  def get_task_detail(task_id)
    body = get_json_data("https://app.asana.com/api/1.0/tasks/#{task_id}")
    body["data"]
  end
  
  # -----------------------------------------------------------------------
  # AppleScripts
  # -----------------------------------------------------------------------

  def project_osascript(project_name)
    %Q{
      tell application "OmniFocus"
      	tell front document
      		set myFolder to folder "Asana"
      		try
      			set myProject to project "#{project_name}" in folder "Asana"
      		on error
      			-- Project is Missing, create it
      			set myProject to make new project with properties {name: "#{project_name}"} at end of projects of myFolder
      		end try
      	end tell
      end tell
    }
  end

  def project_task_osascript(project_name, task_name, note, completed, due_date, context)
    if due_date.nil?
      due_date_str = '"none"'
    else
      due_date_str = "date \"#{due_date}\""
    end
    completed_str = (completed ? 'true' : 'false')
    %Q{
      tell application "OmniFocus"
      	tell front document
      		set myFolder to folder "Asana"
      		set myProject to project "#{project_name}" in folder "Asana"
      		set isCompleted to #{completed_str}
      		set dueDate to #{due_date_str}
      		set newContext to "#{context}"
          
      		if (newContext ≠ "none") then
      			set parentContext to context "People"
      			try
      				set myContext to first flattened context whose name is newContext
      			on error
      				-- Context is Missing, create it
      				tell parentContext
      					set myContext to make new context with properties {name:newContext}
      				end tell
      			end try
      		end if
          
      		try
      			set myTask to task "#{task_name}" in myProject
      		on error
      			-- Task is Missing, create it unless completed?
      			if (isCompleted = false) then
      				set myTask to make new task with properties {name:"#{task_name}"} at end of tasks of myProject
      			end if
      		end try
		
      		-- At this point, myTask exists if not completed
      		-- Since AppleScript has no test of undefined, wrap the next block
		
      		try
        		if (isCompleted = true) then
        			-- if it exists and is completed
        			tell myTask
        				set its completed to true
        			end tell
        		else
        			-- Update its notes and dates
        			tell myTask
        				set its note to "#{note}"
        				if (newContext ≠ "none") then
        					set its context to myContext
        				end if
        				if (dueDate ≠ "none") then
        					set its due date to dueDate
        				end if
        			end tell
        		end if
      		on error
      			-- No, just the task is complete, no clutter in OmniFocus
      		end try
		
      	end tell
      end tell
    }
  end

  def project_sub_task_osascript(project_name, parent_task_name, task_name, note, completed, due_date, context)
    if due_date.nil?
      due_date_str = '"none"'
    else
      due_date_str = "date \"#{due_date}\""
    end
    completed_str = (completed ? 'true' : 'false')
    %Q{
      tell application "OmniFocus"
      	tell front document
      		set myFolder to folder "Asana"
      		set parentTask to task "#{parent_task_name}" in project "#{project_name}" in folder "Asana"
      		set isCompleted to #{completed_str}
      		set dueDate to #{due_date_str}
          set newContext to "#{context}"
          
      		if (newContext ≠ "none") then
      			set parentContext to context "People"
      			try
      				set myContext to first flattened context whose name is newContext
      			on error
      				-- Context is Missing, create it
      				tell parentContext
      					set myContext to make new context with properties {name:newContext}
      				end tell
      			end try
      		end if
          
      		try
      			set myTask to task "#{task_name}" in parentTask
      		on error
      			-- Task is Missing, create it unless completed?
      			if (isCompleted = false) then
      				set myTask to make new task with properties {name:"#{task_name}"} at end of tasks of parentTask
      			end if
      		end try
		
      		-- At this point, myTask exists if not completed
      		-- Since AppleScript has no test of undefined, wrap the next block
		
      		try
        		if (isCompleted = true) then
        			-- if it exists and is completed
        			tell myTask
        				set its completed to true
        			end tell
        		else
        			-- Update its notes and dates
        			tell myTask
        				set its note to "#{note}"
        				if (newContext ≠ "none") then
        					set its context to myContext
        				end if
        				if (dueDate ≠ "none") then
        					set its due date to dueDate
        				end if
        			end tell
        		end if
      		on error
      			-- No, just the task is complete, no clutter in OmniFocus
      		end try
		
      	end tell
      end tell
    }
  end

  # -----------------------------------------------------------------------
  # MAIN LOOP
  # -----------------------------------------------------------------------

  def run
    projects = get_projects
    projects.each_pair do |project_id, project_name|
      detail = get_project_detail(project_id)
      # Skip archived projects
      if detail['archived'] == true
        puts "Skipping Archived Project: #{project_name}..."
        next
      end
  
      # Create or update the project in OmniFocus using AppleScript
      %x{osascript -e '#{project_osascript(project_name)}'}
  
      # Project / Tasks
      puts "Tasks for #{project_name}..."
      tasks = get_tasks_in_project(project_id)
      tasks.each_pair do |task_id, task_name|
        next if task_name == "" # We seem to have these!
        detail = get_task_detail(task_id)
    
        # Create or update a task in a project
        notes = detail['notes'].gsub("'", '').gsub("\n", '')
        
        context = 'none'
        unless detail['assignee'].nil?
          if detail['assignee']['name'] != ASIGNEE_NAME
            context = detail['assignee']['name']
          end
        end
        
        %x{osascript -e '#{project_task_osascript(project_name, task_name, notes, detail['completed'], detail['due_on'], context)}'}
        next if detail['completed'] == true # Ignore subtasks
    
        if SUBTASKS == true
          # Project / Task / SubTask
          puts "  Subtasks for #{task_name}..."
          subtasks = get_subtasks_in_task(task_id)
          if subtasks.length > 0
            subtasks.each do |sub_task|
              next if sub_task["name"] == ""
              sub_detail = get_task_detail(sub_task["id"])
              
              sub_context = context
              unless detail['assignee'].nil?
                if detail['assignee']['name'] != ASIGNEE_NAME
                  sub_context = detail['assignee']['name']
                end
              end
        
              # Create or update a subtask in Omnifocus
              sub_notes = sub_detail['notes'].gsub("'", '').gsub("\n", '')
              %x{osascript -e '#{project_sub_task_osascript(project_name, task_name, sub_task['name'], notes, sub_detail['completed'], sub_detail['due_on'], sub_context)}'}
            end
          end
        end
      end
    end
  end
  
end

app = MergeAsanaIntoOmnifocus.new()
app.run()
