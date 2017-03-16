# encoding: utf-8

require 'asciidoctor'

desc "Generate a specifc lesson"
task :generate_lesson, [:output_dir, :lesson, :with_solutions] do |t, args|
  puts "Generate " + args.lesson

  Rake::Task['generate'].execute(Rake::TaskArguments.new(
    [:output_dir, :with_solutions ,:lesson],
    [args.output_dir, args.with_solutions, args.lesson]
  ))
end

desc "Generate full course"
task :generate_course, [:output_dir, :with_solutions] do |t, args|
  puts "Generate full course"

  Rake::Task['generate'].execute(Rake::TaskArguments.new(
    [:output_dir, :with_solutions ,:lesson],
    [args.output_dir, args.with_solutions, 'full-course']
  ))
end

task :generate, [:output_dir, :with_solutions, :lesson] do |t, args|
  solutions = args.with_solutions == "true"
  file_name = args.lesson
  file_name += "-with_solutions" if solutions
  file_name += ".html"

  attributes = {
    'toc' => 'macro',
    'stylesdir' => args.output_dir,
    'stylesheet' => 'expedia.css',
    'imagesdir' =>  'material/images/'
  }

  attributes['solutions'] = solutions if solutions

  Asciidoctor.convert_file args.lesson+"/notes.adoc",
    :safe => 'unsafe',
    :to_dir => args.output_dir,
    :to_file => file_name,
    :attributes => attributes
end
