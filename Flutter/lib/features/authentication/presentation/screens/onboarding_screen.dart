import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/auth_provider.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _careerController = TextEditingController();
  final _interestsController =
      TextEditingController(); // Comma separated for now

  String? _selectedLifePhase;
  String? _selectedMood;

  @override
  void dispose() {
    _careerController.dispose();
    _interestsController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedLifePhase == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select a life phase')),
        );
        return;
      }
      if (_selectedMood == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select your current mood')),
        );
        return;
      }

      final interests = _interestsController.text
          .split(',')
          .map((e) => e.trim())
          .where((e) => e.isNotEmpty)
          .toList();

      await ref
          .read(authStateProvider.notifier)
          .completeOnboarding(
            career: _careerController.text.trim(),
            lifePhase: _selectedLifePhase!,
            mood: _selectedMood!,
            interests: interests,
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);

    ref.listen<AsyncValue>(authStateProvider, (_, state) {
      if (!state.isLoading && state.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(state.error.toString()),
            backgroundColor: AppColors.error,
          ),
        );
      }
    });

    return Scaffold(
      appBar: AppBar(title: const Text('Complete Your Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Tell us about yourself',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'This helps us match you with the right people.',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 32),

              // Career
              TextFormField(
                controller: _careerController,
                decoration: const InputDecoration(
                  labelText: 'Current Career / Role',
                  hintText: 'e.g. Software Engineer, Student, Artist',
                  prefixIcon: Icon(Icons.work_outline),
                ),
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter your career'
                    : null,
              ),
              const SizedBox(height: 16),

              // Life Phase
              DropdownButtonFormField<String>(
                initialValue: _selectedLifePhase,
                decoration: const InputDecoration(
                  labelText: 'Current Life Phase',
                  prefixIcon: Icon(Icons.timeline),
                ),
                items: AppConstants.lifePhases.map((phase) {
                  return DropdownMenuItem(
                    value: phase['id'],
                    child: Text(phase['label']!),
                  );
                }).toList(),
                onChanged: (value) =>
                    setState(() => _selectedLifePhase = value),
              ),
              const SizedBox(height: 16),

              // Mood
              DropdownButtonFormField<String>(
                initialValue: _selectedMood,
                decoration: const InputDecoration(
                  labelText: 'Current Mood',
                  prefixIcon: Icon(Icons.mood),
                ),
                items: AppConstants.moods.map((mood) {
                  return DropdownMenuItem(
                    value: mood.toLowerCase(),
                    child: Text(mood),
                  );
                }).toList(),
                onChanged: (value) => setState(() => _selectedMood = value),
              ),
              const SizedBox(height: 16),

              // Interests
              TextFormField(
                controller: _interestsController,
                decoration: const InputDecoration(
                  labelText: 'Interests (comma separated)',
                  hintText: 'e.g. Coding, Music, Hiking',
                  prefixIcon: Icon(Icons.interests_outlined),
                ),
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter at least one interest'
                    : null,
              ),
              const SizedBox(height: 32),

              ElevatedButton(
                onPressed: authState.isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: AppColors.primary,
                ),
                child: authState.isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Complete Setup'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
